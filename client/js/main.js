$(function() {

  function getVal(name, ref) {
    var selector = 'input[name="' + name + '"]';
    return ref.find(selector).val();
  }

  $('form').on('submit', function(e) {
    e.preventDefault();
    // Let's hash the password here before sending over the wire
    var hashBitArray = sjcl.hash.sha256.hash($(this).find('input[type="password"]').val());
    var hashedPw = sjcl.codec.hex.fromBits(hashBitArray);
    var userData = {
      firstname: getVal("firstname", $(this)),
      lastname: getVal("lastname", $(this)),
      username: getVal("username", $(this)),
      password: hashedPw
    }; 
    $.post('/register', userData, function(response) {
      console.log('response:', response);
    });
  });

});
